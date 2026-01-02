import { PasswordInput } from "@/components/ui/password-input";
import { JELLYFIN_ACCESS_TOKEN_KEY } from "@/constants/constants";
import useJellyfin from "@/hooks/useJellyfin";
import { useJellyfinStore } from "@/stores/useJellyfinStore";
import { Field } from "@ark-ui/react";
import { Box, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserApi } from '@jellyfin/sdk/lib/utils/api';
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiKey } from "react-icons/bi";
import * as z from 'zod';

const LoginFormSchema = z.object({
  username: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
})

export type LoginForm = z.infer<typeof LoginFormSchema>;
const INPUT_WITH = '280px';

const JellyfinUserLoginForm = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginForm>({
    defaultValues: {
      username: "",
      password: '',
    },
    resolver: zodResolver(LoginFormSchema),
    mode: 'onChange',
  });
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<null | string>(null);
  const { serverAddress } = useParams({ from: "/server/$serverAddress" });
  const { getApi } = useJellyfin();
  const store = useJellyfinStore();

  useEffect(() => {
    const session = sessionStorage.getItem(JELLYFIN_ACCESS_TOKEN_KEY);
    if (session) {
      navigate({
        to: "/server/$serverAddress/sessions",
        params: {
          serverAddress: serverAddress,
        }
      })
    } else {
      getApi(serverAddress);
    }

    return () => {
      store.clearSessionList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(data: LoginForm) {
    setLoading(true);
    store.clearSessionList();
    setLoginError('');
    try {
      // await getServers(data.hostUrl);
      if (!store.api) {
        throw Error("API is not set or failed to be set")
      }
      const auth = await getUserApi(store.api).authenticateUserByName({
        authenticateUserByName: { Username: data.username, Pw: data.password }
      });
      if (auth.data.AccessToken) {
        sessionStorage.setItem(JELLYFIN_ACCESS_TOKEN_KEY, auth.data.AccessToken);
        navigate({
          to: '/server/$serverAddress/sessions',
          params: {
            serverAddress: serverAddress
          }
        })
      }
    } catch (error) {
      console.error(error);
      setLoginError('Unauthorized: Wrong credentials')
    } finally {
      setLoading(false);
    }
  }
  return <form onSubmit={handleSubmit(onSubmit)} data-testid='JellyfinUserLoginForm'>
    <Flex direction='column' gap='3' alignItems='center'>
      <Box w={INPUT_WITH}>
        <Field.Root>
          <Field.Label>
            Username <Field.RequiredIndicator />
          </Field.Label>
          <Input type='text' placeholder="Type your username" {...register('username')} variant='outline' borderColor={!isValid && errors.username ? 'red' : 'inherit'} />
        </Field.Root>
        {!isValid && errors.username && <Text color='red.500' fontSize='sm' textAlign='center'>You must provide a valid username</Text>}

      </Box>
      <Box w={INPUT_WITH}>
        <Field.Root>
          <Field.Label>
            Password <Field.RequiredIndicator />
          </Field.Label>
          <PasswordInput placeholder="Type your password" {...register('password')} variant='outline' borderColor={!isValid && errors.password ? 'red' : 'inherit'} />
        </Field.Root>
        {!isValid && errors.username && <Text color='red.500' fontSize='sm' textAlign='center'>You must provide a valid password</Text>}
      </Box>
      <IconButton w={INPUT_WITH} disabled={!isValid} type="submit" loading={loading}>
        <BiKey />
        Login
      </IconButton>
      {loginError !== null && <Text color='red.500' fontSize='sm' textAlign='center'>{loginError}</Text>}
    </Flex>
  </form>;
};

export default JellyfinUserLoginForm;
