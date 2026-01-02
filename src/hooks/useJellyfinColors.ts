import { useColorModeValue } from "@/components/ui/color-mode"

const useJellyfinColors = () => {
  
  // -------- [AI Content] may contain some alucination --------
  // I double checked in case it may contain some errors, but didn't want to wast time on this
  const accent = useColorModeValue("cyan.500", "cyan.400")
  const bg = useColorModeValue("blue.50", "blue.950")
  const hoverBg = useColorModeValue("blue.100", "blue.800")
  const borderColor = useColorModeValue("blue.200", "blue.700")
  const titleColor = useColorModeValue("blue.900", "blue.50")
  const subtitleColor = useColorModeValue("blue.700", "blue.300")
  //-------- [AI Content] may contain some alucination --------

  return {
    accent,
    bg,
    hoverBg,
    borderColor,
    titleColor,
    subtitleColor,
  }
}

export default useJellyfinColors;