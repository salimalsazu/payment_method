"use client";

import { useForm } from "@mantine/form";
import { TextInput, Button, Group, PasswordInput, Box } from "@mantine/core";
import { useAddUserMutation } from "../redux/userApi";

const FormComponent = () => {
  const [createUser, { isLoading }] = useAddUserMutation();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "",
    },
  });

  const handleSubmit = async (values: any) => {
    const Obj = {
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      role: "SUPERADMIN",
    };

    try {
      await createUser(Obj);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <Box className="w-full">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            label="Email"
            placeholder="Email"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Password"
            {...form.getInputProps("password")}
          />
          <TextInput
            label="First Name"
            placeholder="First Name"
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="Last Name"
            placeholder="Last Name"
            {...form.getInputProps("lastName")}
          />
          <Group mt="md">
            <Button loading={isLoading} type="submit">
              Create User
            </Button>
          </Group>
        </form>
      </Box>
    </div>
  );
};

export default FormComponent;
