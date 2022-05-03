import { Box, Center, Overlay, Text } from '@mantine/core';

type Props = {
  children: React.ReactNode;
  height: number;
  text: string;
};

function TextOverlay({ children, text, height }: Props) {
  return (
    <Box sx={{ height, position: 'relative' }}>
      <Overlay opacity={0.7} color="#000" zIndex={5} p={(height - 30) / 2}>
        <Center>
          <Text size="xl" color="white">
            {text}
          </Text>
        </Center>
      </Overlay>
      {children}
    </Box>
  );
}

export default TextOverlay;
