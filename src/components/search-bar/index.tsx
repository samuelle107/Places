import { yupResolver } from '@hookform/resolvers/yup';
import React, { StrictMode, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

enum SearchFormKey {
  QUERY = 'query',
  NEAR = 'near',
}

export type SearchForm = Record<SearchFormKey, any> & {
  [SearchFormKey.QUERY]: string;
  [SearchFormKey.NEAR]: string;
};

const schema = object().shape({
  [SearchFormKey.QUERY]: string().min(1).required(),
  [SearchFormKey.NEAR]: string(),
});

const defaultvalues: SearchForm = {
  [SearchFormKey.QUERY]: '',
  [SearchFormKey.NEAR]: '',
};

interface Props {
  onSearch: (formData: SearchForm) => Promise<void>;
}

const SearchBar: FC<Props> = ({ onSearch }) => {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultvalues,
  });

  const onSubmit = (formData: SearchForm): void => {
    void onSearch(formData);
  };

  return (
    <StrictMode>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="h-12 shadow-md flex rounded-l bg-gray-100">
          <div className="h-full flex items-center justify-center  px-4">
            <input
              className="outline-none bg-transparent placeholder:text-gray-400 text-gray-800"
              {...register(SearchFormKey.QUERY)}
              placeholder="Restaurants, noodles, campsites"
            />
          </div>

          <div className="w-[2px] bg-gray-200 my-2" />

          <div className="h-full flex items-center justify-center px-4">
            <input
              className="outline-none bg-transparent placeholder:text-gray-400 text-gray-800"
              {...register(SearchFormKey.NEAR)}
              placeholder="Near"
            />
          </div>

          {/* Search button */}
          <button className="bg-gray-800 relative z-20 hover:bg-black w-12 h-12 rounded-r transition-all text-white flex items-center justify-center">
            <span className="material-icons">search</span>
          </button>
        </div>
      </form>
    </StrictMode>
  );
};

export default SearchBar;
