import React, { useState } from 'react';
import { Button } from '~/core/ui/Button';
import { Input } from '~/core/ui/input';
import Label from '~/core/ui/Label';
import { Skeleton } from '~/core/ui/skeleton';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline';

export type Kpi = {
  name: string;
  date: string;
  price: string;
};

type KPIFormProps = {
  kpis: Kpi[];
  setKpis: (kpis: Kpi[]) => void;
};

function KPIForm({ kpis, setKpis }: KPIFormProps) {
  const addKpi = () => {
      setKpis([...kpis, { name: '', date: '', price: '' }]);
  };

  const deleteKpi = (index: number) => {
      setKpis(kpis.filter((_, i) => i !== index));
  };

  const updateKpi = (index: number, field: keyof Kpi, value: string) => {
      const updatedKpis = kpis.map((kpi, i) =>
          i === index ? { ...kpi, [field]: value } : kpi
      );
      setKpis(updatedKpis);
  };

  

  return (
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}> 
      {kpis.map((kpi, index) => (
        <Skeleton key={index} className="p-4 mb-4 relative">
          <Button
            type="button"
            onClick={() => deleteKpi(index)}
            className="absolute top-1 right-2 text-red-500 focus:outline-none focus:ring-0 bg-transparent" // Position the delete button
          >
            <MinusCircleIcon className="h-5 w-5" />
          </Button>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={kpi.name}
              onChange={(e) => updateKpi(index, 'name', e.target.value)}
              placeholder="Enter KPI name"
            />
            <Label>Date</Label>
            <Input
              type="date"
              value={kpi.date}
              onChange={(e) => updateKpi(index, 'date', e.target.value)}
            />
            <Label>Price</Label>
            <Input
              type="number"
              value={kpi.price}
              onChange={(e) => updateKpi(index, 'price', e.target.value)}
              placeholder="Enter KPI price"
            />
          </div>
        </Skeleton>
      ))}
      <div className="flex justify-end">
        <Button type="button" size={'sm'} variant={'outline'} onClick={addKpi} className="mt-4">
          <PlusCircleIcon className={'w-4 mr-2'} />
          <span>Add KPI</span>
        </Button>
      </div>
    </div>
  );
}

export default KPIForm;
