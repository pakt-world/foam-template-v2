'use client';
import * as z from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { useEffect } from 'react';
import { NumericInput } from '@/components/common/numeric-input';

interface JobSearchBarProps {
  search?: string;
  skills?: string;
  range?: string;
  handleSearch?: (filter: any) => void;
  isTalentView?: boolean;
}

const searchFormSchema = z.object({
  search: z.string(),
  skills: z.string(),
  min: z.string(),
  max: z.string(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

export const JobSearchBar = ({ search, skills, range, isTalentView = false, handleSearch }: JobSearchBarProps) => {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
  });
  const setDefaults = () => {
    if (range && range.split(',').length > 1) {
      const minV = range.split(',')[0] ?? '';
      const maxV = range.split(',')[1] ?? '';
      form.setValue('min', minV);
      form.setValue('max', maxV);
    }
    if (search) form.setValue('search', search);
    if (skills) form.setValue('skills', skills);
  };

  useEffect(() => {
    setDefaults();
  }, [search, skills, range]);

  const onSubmit: SubmitHandler<SearchFormValues> = (values) => {
    return (
      handleSearch &&
      handleSearch({
        search: values.search,
        skills: values.skills,
        range: values.min && values.max ? `${values.min},${values.max}` : '',
      })
    );
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="bg-white border-[#7DDE86] border p-6 w-full rounded-2xl flex gap-4 items-end">
        <div className="flex flex-col relative grow gap-1">
          <label htmlFor="" className="text-sm">
            {'Search'}
          </label>
          <input
            type="text"
            placeholder="Name, Category, etc."
            className="bg-gray-50 px-3 border border-line rounded-lg h-11 focus:outline-none"
            {...form.register('search')}
          />
        </div>
        <div className="flex flex-col relative grow gap-1">
          <label htmlFor="" className="text-sm">
            Skill
          </label>
          <input
            type="text"
            placeholder="Java, Solidity, etc."
            className="bg-gray-50 px-3 border border-line rounded-lg h-11 focus:outline-none"
            {...form.register('skills')}
          />
        </div>
        <div className="flex flex-col relative grow gap-1">
          <label htmlFor="" className="text-sm">
            {isTalentView ? 'AfroScore' : 'Price'}
          </label>
          <div className="flex gap-2 border py-2 border-line rounded-lg h-11 bg-gray-50">
            <NumericInput
              placeholder="From"
              className="grow focus:outline-none bg-transparent px-3 placeholder:text-sm"
              {...form.register('min')}
            />
            <div className="border-r border-line" />
            <NumericInput
              type="text"
              placeholder="To"
              className="grow focus:outline-none bg-transparent px-3 placeholder:text-sm"
              {...form.register('max')}
            />
          </div>
        </div>
        <button
          type="submit"
          className="p-2 flex items-center justify-center h-11 bg-[#ECFCE5] text-primary border border-primary px-6 rounded-xl"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};

export const TalentSearchBar = ({ search, skills, range, isTalentView = false, handleSearch }: JobSearchBarProps) => {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
  });
  const setDefaults = () => {
    if (range && range.split(',').length > 1) {
      const minV = range.split(',')[0] ?? '';
      const maxV = range.split(',')[1] ?? '';
      form.setValue('min', minV);
      form.setValue('max', maxV);
    }
    if (search) form.setValue('search', search);
    if (skills) form.setValue('skills', skills);
  };

  useEffect(() => {
    setDefaults();
  }, [search, skills, range]);

  const onSubmit: SubmitHandler<SearchFormValues> = (values) => {
    return (
      handleSearch &&
      handleSearch({
        search: values.search,
        skills: values.skills,
        range: values.min && values.max ? `${values.min},${values.max}` : '',
      })
    );
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="bg-white border-[#7DDE86] border p-6 w-full rounded-2xl flex gap-4 items-end">
        <div className="flex flex-col relative grow gap-1">
          <label htmlFor="" className="text-sm">
            Search
          </label>
          <input
            type="text"
            placeholder="Enter"
            className="bg-gray-50 px-3 border border-line rounded-lg h-11 focus:outline-none"
            {...form.register('search')}
          />
        </div>
        <div className="flex flex-col relative grow gap-1">
          <label htmlFor="" className="text-sm">
            Skill
          </label>
          <input
            type="text"
            placeholder="Enter"
            className="bg-gray-50 px-3 border border-line rounded-lg h-11 focus:outline-none"
            {...form.register('skills')}
          />
        </div>
        <div className="flex flex-col relative grow gap-1">
          <label htmlFor="" className="text-sm">
            {isTalentView ? 'AfroScore' : 'Price'}
          </label>
          <div className="flex gap-2 border py-2 border-line rounded-lg h-11 bg-gray-50">
            <input
              type="text"
              placeholder="From"
              className="grow focus:outline-none bg-transparent px-3 placeholder:text-sm"
              {...form.register('min')}
            />
            <div className="border-r border-line" />
            <input
              type="text"
              placeholder="To"
              className="grow focus:outline-none bg-transparent px-3 placeholder:text-sm"
              {...form.register('max')}
            />
          </div>
        </div>
        <button
          type="submit"
          className="p-2 flex items-center justify-center h-11 bg-[#ECFCE5] text-primary border border-primary px-6 rounded-xl"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};
