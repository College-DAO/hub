interface Organization {
  id: number;
  uuid?: string;
  name?: string;
  email?: string;
  type?: string;
  approved?: boolean;
  socials?: Object;
  logoURL?: string | null;
}

export default Organization;
