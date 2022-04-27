import { Box, Center, Overlay, Text } from '@mantine/core';

type Props = {
  children: React.ReactNode;
  height: number;
};

function ComingSoonOverlay({ children, height }: Props) {
  return (
    <Box sx={{ height, position: 'relative' }}>
      <Overlay opacity={0.6} color="#000" zIndex={5} p={height / 2.5}>
        <Center>
          <Text size="xl" color="white">
            Coming soon
          </Text>
        </Center>
      </Overlay>
      {children}
    </Box>
  );
}

export default ComingSoonOverlay;
