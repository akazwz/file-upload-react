import { useRef, useState } from 'react'
import {
	Heading,
	AspectRatio,
	Box,
	Input,
	Text,
	HStack,
	VStack,
	Tooltip,
	Spacer,
	useColorModeValue,
} from '@chakra-ui/react'
import { Correct, FileAdditionOne, UploadOne } from '@icon-park/react'
import axios from 'axios'

import { ellipsisTextStartAndEnd, FilesizeUnit } from '../utils'
import { HashFile } from '../utils/file'
import { ColorModeToggle } from '../components/ColorModeToggle'

const Home = () => {
	const inputRef = useRef<HTMLInputElement>(null)

	const [filename, setFilename] = useState<string>('')
	const [filesize, setFilesize] = useState<number | null>(null)
	const [progress, setProgress] = useState(0)

	const [borderColor, setBorderColor] = useState<string>('')

	const handleSelectFile = () => {
		inputRef.current?.click()
	}

	// handle after select file
	const handleFileChange = async() => {
		const file = inputRef.current?.files?.item(0)
		if (!file) {
			return
		}
		setFilename(file.name)
		setFilesize(file.size)
		// get hashcode
		const hashcode = await HashFile(file, 'sha256')
		console.log(hashcode)

		/*const form = new FormData()
		form.append('file', file)

		// simple upload
		await axios.post('http://localhost:8080/file', form, {
			// upload progress
			onUploadProgress: (progressEvent: ProgressEvent) => {
				const p = (progressEvent.loaded / file.size) * 100
				setProgress(p)
			}
		})*/

		const chunkSize = 1024 * 1024
		const chunksSum = Math.ceil(file.size / chunkSize)
		console.log(chunksSum)

		// 切片文件
		for (let index = 0, chunkIndex = 0; index < file.size; index += chunkSize, chunkIndex++) {
			const chunkFile = file.slice(index, index + chunkSize)
			const chunkHash = await HashFile(chunkFile, 'sha256')
			const form = new FormData()
			form.append('chunk_file', chunkFile)
			form.append('chunk_index', String(chunkIndex))
			form.append('chunk_hash', String(chunkHash))
			form.append('chunk_sum', String(chunksSum))
			form.append('file_hash', hashcode)
			try {
				await axios.post('http://localhost:8080/file/chunk', form, {})
				if (chunkIndex === chunksSum) {
					console.log('finish')
				}
			} catch (e) {
				console.log(e)
			} finally {

			}
		}

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
				filesize ? <UploadItem filename={filename} filesize={filesize} progress={progress} /> : null
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
			<HStack w="full" position="relative" height="70px" p={3} mt="-70px">
				<Box>
					<FileAdditionOne size={45} strokeWidth={2} />
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
				<Spacer />
				{
					progress >= 100 ? (
						<Box>
							<Correct theme="filled" fill={'green'} size={27} />
						</Box>
					) : null
				}
			</HStack>
		</Box>
	)
}

export default Home
