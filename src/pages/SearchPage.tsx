import { Box, Text } from "@chakra-ui/react";
import { Layout } from "../components/common/Layout";
import { SearchBar } from "../components/search/SearchBar";
import { useState } from "react";
import { searchUsers, UserSearchResult } from "../api/search";
import { List } from "../components/common/List";
import { UserDetailSmall } from "../components/users/UserDetailSmall";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  return (
    <Layout>
      <SearchBar
        onSearch={async (searchTerm) => {
          const results = await searchUsers(searchTerm);
          setSearchResults(results)
        }}
      />
      <Box mt={4}>
        <List 
          elements={searchResults}
          getKey={(user) => user.id}
          renderElement={(user) => (
            <UserDetailSmall user={user} asLink />
          )}
          ifEmpty={<Text>No results</Text>}
        />
      </Box>
    </Layout>
  );
};

export default SearchPage;
