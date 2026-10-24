import { IconButton, Input, Stack } from '@chakra-ui/react';
import { FormEvent, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <Stack as="form" direction="row" align="center" onSubmit={handleSubmit}>
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        size="sm"
        variant="subtle"
        maxWidth={300}
      />
      <IconButton type="submit" size="sm" variant="subtle" aria-label="Search">
        <FiSearch />
      </IconButton>
    </Stack>
  );
};
