import { Box, Text } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import { SearchBar } from "../components/SearchBar";
import { useState } from "react";
import { searchUsers } from "../api/search";
import { UserDetailSmall } from "../components/UserDetailSmall";

interface UserSearchResult {
  id: string;
	username: string;
	firstName: string;
	lastName: string;
	imageUrl: string;
}

interface SearchPageProps {
}

const SearchPage: React.FC<SearchPageProps> = () => {
  const [searchResults, setSeachResults] = useState<UserSearchResult[]>([]);
  return (
    <Layout>
      <SearchBar
        onSearch={async (searchTerm) => {
					console.log('searchTerm', searchTerm)
          const results = await searchUsers(searchTerm);
					console.log({ results })
          setSeachResults(results)
        }}
      />
      <Box>
        {searchResults.map((result) => (
					<UserDetailSmall key={result.id} user={result} asLink />
        ))}
      </Box>
    </Layout>
  );
};

export default SearchPage;
