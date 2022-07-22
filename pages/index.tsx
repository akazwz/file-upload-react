import {
	Heading,
	AspectRatio,
	Box,
	Input,
	Text,
	HStack,
	VStack,
	Tooltip, useColorModeValue
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { ImageFiles, UploadOne } from '@icon-park/react'

import { ellipsisTextStartAndEnd, FilesizeUnit } from '../utils'
import { ColorModeToggle } from '../components/ColorModeToggle'

const Home = () => {
	const inputRef = useRef<HTMLInputElement>(null)

	const [filename, setFilename] = useState<string>('')
	const [filetype, setFiletype] = useState<string>('')
	const [filesize, setFilesize] = useState<number | null>(null)

	const [borderColor, setBorderColor] = useState<string>('')

	const handleSelectFile = () => {
		inputRef.current?.click()
	}

	const handleFileChange = () => {
		const file = inputRef.current?.files?.item(0)
		if (!file) {
			return
		}
		setFilename(file.name)
		setFiletype(file.type)
		setFilesize(file.size)
	}

	return (
		<Box maxW="md" mx="auto" p={3}>
			<ColorModeToggle />
			<Heading textAlign="center">
				Upload File
			</Heading>
			<Box
				m={3}
				onClick={handleSelectFile}
				onDragOver={(e) => {
					e.preventDefault()
					setBorderColor('blue.500')
					console.log('on drag over')
				}}
				onDragLeave={(e) => {
					e.preventDefault()
					setBorderColor('')
					console.log('on drag leave')
				}}
				onDrop={(e) => {
					e.preventDefault()
					setBorderColor('')
					console.log('on drop')
				}}
			>
				<AspectRatio maxW="700px" ratio={21 / 9}>
					<Box borderWidth={3} borderStyle="dashed" borderColor={borderColor} rounded="lg">
						<VStack>
							<UploadOne size={70} strokeWidth={2} />
						</VStack>
					</Box>
				</AspectRatio>
				<Input
					type="file"
					hidden
					ref={inputRef}
					multiple={false}
					onChange={handleFileChange}
				/>
			</Box>
			{
				filesize ? <UploadItem filename={filename} filesize={filesize} progress={100} /> : null
			}
		</Box>
	)
}

interface UploadItemProps{
	filename: string
	filesize: number
	progress: number
}

export const UploadItem = ({ filename, filesize, progress }: UploadItemProps) => {
	const tooltipBg = useColorModeValue('white', 'black')
	const tooltipColor = useColorModeValue('black', 'white')
	const progressBg = useColorModeValue('blue.100', 'blue.900')

	return (
		<Box borderWidth={1} p={0} rounded="lg" height="70px" alignItems="flex-start" overflow="hidden">
			{/* progress bg */}
			<Box
				width={`${progress}%`}
				height={'70px'}
				bg={progressBg}
				rounded="lg"
				roundedRight={0}
			>
			</Box>
			{/* relative content */}
			<HStack w="full" position="relative" height="70px" p={1} mt="-70px">
				<Box>
					<ImageFiles size={45} strokeWidth={2} />
				</Box>
				<VStack spacing={0} alignItems="start" overflow="hidden">
					<Box>
						<Tooltip
							hasArrow
							bg={tooltipBg}
							color={tooltipColor}
							label={filename}
						>
							<Text fontWeight="semibold">{ellipsisTextStartAndEnd(filename, 9, 7)}</Text>
						</Tooltip>
					</Box>
					<Text fontWeight="semibold" color="gray.500">{FilesizeUnit(filesize)}</Text>
				</VStack>
			</HStack>
		</Box>
	)
}

export const PlayerProgress = ({ value }: { value: number }) => {
	return (
		<Box
			flex={1}
			width="full"
			height={1}
			bg="gray.500"
			position="relative"
			rounded="full"
			overflow="hidden"
		>
			<Box
				width={`${value}%`}
				height={1}
				bg="blue.500"
				rounded="full"
			/>
		</Box>
	)
}

export default Home
