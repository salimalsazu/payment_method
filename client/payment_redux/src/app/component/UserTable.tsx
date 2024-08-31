"use client";
// Adjust the import according to your file structure
import { Table, Loader, Box } from "@mantine/core";
import { useGetUserQuery } from "../redux/userApi";

const UserTable = () => {
  const { data: users, isLoading, error } = useGetUserQuery(null);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error fetching users</div>;
  }

  const rows = users?.data?.data?.map((element: any) => (
    <Table.Tr key={element.userId}>
      <Table.Td>{element.profile.firstName}</Table.Td>
      <Table.Td>{element.profile.lastName}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>{element.profile.role}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Box className="w-full">
      <Table stickyHeader stickyHeaderOffset={100} className="w-full">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>First Name</Table.Th>
            <Table.Th>Last Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Box>
  );
};

export default UserTable;
