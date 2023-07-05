import { Box, Input, IconButton } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box display="flex" alignItems="center">
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        size="sm"
        variant="filled"
        mr={2}
				maxWidth={300}
      />
      <IconButton
				size="sm"
        icon={<SearchIcon />}
        aria-label="Search"
        onClick={handleSearch}
      />
    </Box>
  );
};

