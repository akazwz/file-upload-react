import { useRef, useState, DragEvent } from 'react'
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
	Spinner,
	useColorModeValue,
} from '@chakra-ui/react'
import { Correct, FileAdditionOne, UploadOne } from '@icon-park/react'

import { ellipsisTextStartAndEnd, FilesizeUnit } from '../utils'
import { HashFile } from '../utils/file'
import { ColorModeToggle } from '../components/ColorModeToggle'
import { ChunkUpload, SimpleUpload } from '../utils/upload'

const Home = () => {
	const inputRef = useRef<HTMLInputElement>(null)

	const [filename, setFilename] = useState<string>('')
	const [filesize, setFilesize] = useState<number | null>(null)
	const [progress, setProgress] = useState(0)

	const [hashing, setHashing] = useState(false)

	const [borderColor, setBorderColor] = useState<string>('')

	// 弹出选择文件
	const handleSelectFile = () => {
		inputRef.current?.click()
	}

	// 选择文件之后
	const handleFileChange = async() => {
		// 获取文件
		const file = inputRef.current?.files?.item(0)
		if (!file) {
			return
		}
		await upload(file)
	}

	// 拖拽上传文件
	const handleBoxOnDrop = async(e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setBorderColor('')
		const file = e.dataTransfer.files.item(0)
		if (!file) return
		await upload(file)
	}

	const upload = async(file: File) => {
		// 上传之前重置 进度
		setProgress(0)
		setFilename(file.name)
		setFilesize(file.size)
		// 获取 文件 hash
		setHashing(true)
		const hash = await HashFile(file, 'sha256')
		setHashing(false)

		// 根据文件大小判断是否需要分段上传
		if (file.size > 30 * 1024 * 1024) {
			// 切片上传
			await ChunkUpload(file, hash, setProgress)
		} else {
			// 普通上传
			await SimpleUpload(file, hash, setProgress)
		}
	}

	return (
		<Box maxW="md" mx="auto" p={3}>
			<ColorModeToggle />
			<Heading textAlign="center">
				Upload File
			</Heading>
			{/* 上传 box, 可以点击选择文件上传， 可以拖拽上传 */}
			<Box
				m={3}
				onClick={handleSelectFile}
				onDragOver={(e) => {
					e.preventDefault()
					setBorderColor('blue.500')
				}}
				onDragLeave={(e) => {
					e.preventDefault()
					setBorderColor('')
				}}
				onDrop={handleBoxOnDrop}
			>
				{/*  */}
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
				filesize ? <UploadItem filename={filename} filesize={filesize} hashing={hashing} progress={progress} /> : null
			}
		</Box>
	)
}

interface UploadItemProps{
	filename: string
	filesize: number
	progress: number
	hashing: boolean
}

export const UploadItem = ({ filename, filesize, hashing, progress }: UploadItemProps) => {
	const tooltipBg = useColorModeValue('white', 'black')
	const tooltipColor = useColorModeValue('black', 'white')
	const progressBg = useColorModeValue('blue.100', 'blue.900')

	return (
		<Box borderWidth={1} p={0} rounded="lg" height="70px" alignItems="flex-start" overflow="hidden">
			{/* 进度条背景 */}
			<Box
				width={`${progress}%`}
				height={'70px'}
				bg={progressBg}
				rounded="lg"
				roundedRight={0}
			>
			</Box>
			{/* 相对定位内容： 上传文件信息， 文件名， 文件大小等 */}
			<HStack w="full" position="relative" height="70px" p={3} mt="-70px">
				<Box>
					<FileAdditionOne size={45} strokeWidth={2} />
				</Box>
				<VStack spacing={0} alignItems="start" overflow="hidden">
					<Box>
						{/* 文件名全称 tooltip */}
						<Tooltip
							hasArrow
							bg={tooltipBg}
							color={tooltipColor}
							label={filename}
						>
							{/* 文件名过长缩略 */}
							<Text fontWeight="semibold">{ellipsisTextStartAndEnd(filename, 9, 7)}</Text>
						</Tooltip>
					</Box>
					<Text fontWeight="semibold" color="gray.500">{FilesizeUnit(filesize)}</Text>
				</VStack>
				<Spacer />
				{
					/* 文件上传完成时显示 ✅ */
					progress >= 100 ? (
						<Box>
							<Correct theme="filled" fill={'green'} size={27} />
						</Box>
					) : null
				}
				{
					/* 计算文件 hash 时显示 spinner */
					hashing ? <Spinner /> : null
				}
			</HStack>
		</Box>
	)
}

export default Home
