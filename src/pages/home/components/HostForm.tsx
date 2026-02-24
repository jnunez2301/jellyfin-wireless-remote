import useJellyfin from '@/hooks/useJellyfin';
import { type RecentServerEntry, RecentServers } from '@/models/RecentServers';
import { Box, Field, Flex, IconButton, Input, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiSearch, BiX } from 'react-icons/bi';
import * as z from 'zod';

const recentServers = new RecentServers();

const HostFormSchema = z.object({
  hostUrl: z.string()
    .min(1, "Host URL is required")
    .transform((value) => {
      const trimmed = value.trim();
      if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
      }
      return `http://${trimmed}`;
    })
    .refine((value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }, {
      message: "Please enter a valid host address (e.g., 192.168.50.66:8096 or domain.com)"
    })
})

export type iHostForm = z.infer<typeof HostFormSchema>;

const HostForm = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<RecentServerEntry[]>([]);
  const { getServers } = useJellyfin();

  const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm<iHostForm>({
    defaultValues: {
      hostUrl: "",
    },
    resolver: zodResolver(HostFormSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    setSuggestions(recentServers.getServers());
  }, []);

  async function onSubmit(data: iHostForm) {
    setLoading(true);
    try {
      const found = await getServers(data.hostUrl);
      if (found.length > 0) {
        recentServers.addServer(data.hostUrl);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestionClick(url: string) {
    setValue('hostUrl', url, { shouldValidate: true });
    handleSubmit(onSubmit)();
  }

  function handleRemoveSuggestion(e: React.MouseEvent, url: string) {
    e.stopPropagation();
    recentServers.removeServer(url);
    setSuggestions(recentServers.getServers());
  }

  function formatDate(ts: number): string {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(ts));
  }

  return <form onSubmit={handleSubmit(onSubmit)} data-testid='JellyfinHostForm'>
    <Flex direction='column' gap='3' alignItems='center'>
      <Box>
        <Field.Root required>
          <Field.Label>
            Host Address
          </Field.Label>
          <Field.HelperText>Your host must be the ip or domain you assigned to, remember that the default port is 8096</Field.HelperText>
          <Input min={1} max={255} placeholder="Type your host eg: http://127.0.0.1:8096" {...register('hostUrl')} variant='outline' borderColor={!isValid && errors.hostUrl ? 'red' : 'inherit'} />
        </Field.Root>
        {!isValid && errors.hostUrl && <Text color='red.500' fontSize='sm' textAlign='center'>You must type a valid url</Text>}
      </Box>

      {suggestions.length > 0 && (
        <Box w='100%'>
          <Text fontSize='xs' color='fg.muted' mb='1'>Recent servers</Text>
          <Flex direction='column' gap='1'>
            {suggestions.map(({ url, addedAt }) => (
              <Flex
                key={url}
                align='center'
                justify='space-between'
                px='3'
                py='2'
                borderRadius='md'
                border='1px solid'
                borderColor='border.subtle'
                cursor='pointer'
                _hover={{ bg: 'bg.subtle' }}
                onClick={() => handleSuggestionClick(url)}
              >
                <Flex direction='column' gap='0' overflow='hidden'>
                  <Text fontSize='sm' truncate>{url}</Text>
                  <Text fontSize='xs' color='fg.muted'>{formatDate(addedAt)}</Text>
                </Flex>
                <IconButton
                  aria-label='Remove server'
                  size='xs'
                  variant='ghost'
                  onClick={(e) => handleRemoveSuggestion(e, url)}
                >
                  <BiX />
                </IconButton>
              </Flex>
            ))}
          </Flex>
        </Box>
      )}

      <IconButton type='submit' variant='subtle' disabled={!isValid} loading={loading} p='5'>
        <BiSearch />
        Find Server
      </IconButton>
    </Flex>
  </form>;
};

export default HostForm;
