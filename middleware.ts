import { NextRequest, NextResponse } from 'next/server';
import csrf from 'edge-csrf';
import HttpStatusCode from '~/core/generic/http-status-code.enum';
import configuration from '~/configuration';
import createMiddlewareClient from '~/core/supabase/middleware-client';
import GlobalRole from '~/core/session/types/global-role';

const CSRF_SECRET_COOKIE = 'csrfSecret';
const NEXT_ACTION_HEADER = 'next-action';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|locales|assets|api/stripe/webhook|auth|pending-approval|error).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const csrfResponse = await withCsrfMiddleware(request, response);
  const sessionResponse = await sessionMiddleware(request, csrfResponse);
  const orgStatusResponse = await organizationStatusMiddleware(request, sessionResponse);

  return await adminMiddleware(request, orgStatusResponse);
}

async function sessionMiddleware(req: NextRequest, res: NextResponse) {
  const supabase = createMiddlewareClient(req, res);
  await supabase.auth.getSession();
  return res;
}

async function withCsrfMiddleware(request: NextRequest, response = new NextResponse()) {
  const csrfMiddleware = csrf({
    cookie: {
      secure: configuration.production,
      name: CSRF_SECRET_COOKIE,
    },
    ignoreMethods: isServerAction(request)
      ? ['POST']
      : ['GET', 'HEAD', 'OPTIONS'],
  });

  const csrfError = await csrfMiddleware(request, response);

  if (csrfError) {
    return NextResponse.json('Invalid CSRF token', {
      status: HttpStatusCode.Forbidden,
    });
  }

  return response;
}

function isServerAction(request: NextRequest) {
  const headers = new Headers(request.headers);
  return headers.has(NEXT_ACTION_HEADER);
}

async function organizationStatusMiddleware(request: NextRequest, response: NextResponse) {
  const supabase = createMiddlewareClient(request, response);
  const { data: { user } } = await supabase.auth.getUser();

  const excludedPaths = ['/api', '/auth', '/error', '/loading', '/pending-approval', '/onboarding'];
  if (excludedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return response;
  }

  if (user) {
    // Fetch all memberships for the user
    const { data: memberships, error: membershipsError } = await supabase
      .from('memberships')
      .select('organization_id')
      .eq('user_id', user.id);

      if (membershipsError || !memberships || memberships.length === 0) {
        console.log("membership error: ")
        console.log(membershipsError);
        if (!request.url.includes('/onboarding')) {
          return NextResponse.redirect(`${configuration.site.siteUrl}/onboarding`);
        } else {
          console.log("on onboarding")
          return response
        }
      }

    // Check the approval status of each organization
    if (memberships && memberships.length > 0) {
      for (const membership of memberships) {
        const { data: organization, error: orgError } = await supabase
          .from('organizations')
          .select('approved')
          .eq('id', membership.organization_id)
          .single();
  
        if (orgError) {
          console.log(orgError);
          continue;
        }
  
        if (!organization?.approved) {
          return NextResponse.redirect(`${configuration.site.siteUrl}/pending-approval`);
        }
      }
    }
    // If all organizations are approved, proceed
    return response;
  } else {
    return NextResponse.redirect(`${configuration.site.siteUrl}${configuration.paths.signIn}`);
  }
}


async function adminMiddleware(request: NextRequest, response: NextResponse) {
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

  if (!isAdminPath) {
    return response;
  }

  const supabase = createMiddlewareClient(request, response);
  const user = await supabase.auth.getUser();

  // If user is not logged in, redirect to sign in page.
  // This should never happen, but just in case.
  if (!user) {
    return NextResponse.redirect(configuration.paths.signIn);
  }

  const role = user.data.user?.app_metadata['role'];

  // If user is not an admin, redirect to 404 page.
  if (!role || role !== GlobalRole.SuperAdmin) {
    return NextResponse.redirect(`${configuration.site.siteUrl}/404`);
  }

  // in all other cases, return the response
  return response;
}

