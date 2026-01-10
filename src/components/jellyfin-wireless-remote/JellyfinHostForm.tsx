import { VITE_JELLYFIN_DEFAULT_HOST } from '@/environment';
import useJellyfin from '@/hooks/useJellyfin';
import { Box, Field, Flex, IconButton, Input, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiSearch } from 'react-icons/bi';
import * as z from 'zod';

const HostFormSchema = z.object({
  hostUrl: z.url()
})

export type HostForm = z.infer<typeof HostFormSchema>;


const JellyfinHostForm = () => {
  const [loading, setLoading] = useState(false);
  const { getServers } = useJellyfin();

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<HostForm>({
    defaultValues: {
      hostUrl: "",
    },
    resolver: zodResolver(HostFormSchema),
    mode: 'onChange',
  })
  async function onSubmit(data: HostForm) {
    setLoading(true)
    try {
      await getServers(data.hostUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useQuery({
    queryKey: ['jellyfin-default-host'],
    queryFn: async () => {
      const response = await getServers(VITE_JELLYFIN_DEFAULT_HOST)
      return response;
    },
    enabled: typeof VITE_JELLYFIN_DEFAULT_HOST != 'undefined'
  });

  return <form onSubmit={handleSubmit(onSubmit)} data-testid='JellyfinHostForm'>
    <Flex direction='column' gap='3' alignItems='center'>
      <Box>
        <Field.Root required>
          <Field.Label>
            Host Address
          </Field.Label>
          <Field.HelperText>Your host must be the ip or domain you assigned to, remember that the default port is 8096</Field.HelperText>
          <Input type='url' placeholder="Type your host eg: http://127.0.0.1:8096" {...register('hostUrl')} variant='outline' borderColor={!isValid && errors.hostUrl ? 'red' : 'inherit'} />
        </Field.Root>
        {!isValid && errors.hostUrl && <Text color='red.500' fontSize='sm' textAlign='center'>You must type a valid url</Text>}
      </Box>
      <IconButton type='submit' variant='subtle' disabled={!isValid} loading={loading} p='5'>
        <BiSearch />
        Find Server
      </IconButton>
    </Flex>
  </form>;
};

export default JellyfinHostForm;
