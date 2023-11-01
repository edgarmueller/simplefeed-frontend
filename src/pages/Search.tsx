import { Box, Text } from "@chakra-ui/react";
import { Layout } from "../components/common/Layout";
import { SearchBar } from "../components/search/SearchBar";
import { useState } from "react";
import { searchUsers } from "../api/search";
import { List } from "../components/common/List";
import { UserDetailSmall } from "../components/users/UserDetailSmall";

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
          const results = await searchUsers(searchTerm);
          setSeachResults(results)
        }}
      />
      <Box mt={4}>
        <List 
          elements={searchResults}
          renderElement={(user) => (
            <UserDetailSmall key={user.id} user={user as any} asLink />
          )}
          ifEmpty={<Text>No results</Text>}
        />
      </Box>
    </Layout>
  );
};

export default SearchPage;
