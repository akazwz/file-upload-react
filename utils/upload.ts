import axios from 'axios'

import { HashFile } from './file'

export const SimpleUpload = async(file: File, hash: string, setProgress: (value: number) => void) => {
	const form = new FormData()
	form.append('file', file)
	form.append('hash', hash)

	await axios.post('http://localhost:8080/file', form, {
		// 上传进度
		onUploadProgress: (progressEvent: ProgressEvent) => {
			const p = (progressEvent.loaded / file.size) * 100
			setProgress(p)
		}
	})
}

export const ChunkUpload = async(file: File, hash: string, setProgress: (value: number) => void) => {
	// 默认 分块大小
	const chunkSize = 1024 * 1024
	// 分块总个数
	const chunksSum = Math.ceil(file.size / chunkSize)
	// 所有的分块 index
	const indexesTotal: number[] = [...Array(chunksSum).keys()]
	// 已经上传的分块文件 index
	let indexesReady: number[] = []

	// 获取上传状态
	const res = await axios.get('http://localhost:8080/file/chunk/state', {
		params: {
			hash,
		}
	})

	// 获取服务端返回数据
	const { code, indexes } = res.data
	// 判断 业务code
	switch (code) {
// 正常，获取到已上传分块
		case 2000:
			console.log('正常， 获取到已经上传分块')
			indexesReady = indexes
			break
		// 没有文件夹
		case 2001:
			console.log('没有文件夹')
			break
		// 上传成功
		case 2002:
			console.log('上传成功')
			setProgress(100)
			return
		// 文件夹为空
		case 2003:
			console.log('文件夹为空')
			break
	}

	// 所有分块上传完毕， 等待合并
	if (indexesReady.length === chunksSum) {
		const form = new FormData()
		form.append('chunk_sum', String(chunksSum))
		form.append('file_hash', hash)

		await axios.post('http://localhost:8080/file/chunk/merge', form, {})
		setProgress(100)
		console.log('所有分块上传完毕,已经合并，上传成功')
	}

	// 获取数组交集，得到已经成功上传的 分块文件 index 数组 （分块上传时跳过， 断点续传）
	const uploadedIndex = indexesTotal.filter((item) => indexesReady.includes(item))

	// 切片文件遍历上传
	for (let index = 0, chunkIndex = 0; index < file.size; index += chunkSize, chunkIndex++) {
		// 在上传成功的分块 index 中， 无需上传分块
		if (uploadedIndex.includes(chunkIndex)) {
			continue
		}

		const chunkFile = file.slice(index, index + chunkSize)
		const chunkHash = await HashFile(chunkFile, 'sha256')

		const form = new FormData()
		form.append('chunk_file', chunkFile)
		form.append('chunk_index', String(chunkIndex))
		form.append('chunk_hash', String(chunkHash))
		form.append('chunk_sum', String(chunksSum))
		form.append('file_hash', hash)
		// 上传分块
		await axios.post('http://localhost:8080/file/chunk', form, {})
		// 所有分块上传完毕, 调用 合并文件接口
		if (chunkIndex === chunksSum - 1) {
			await axios.post('http://localhost:8080/file/chunk/merge', form, {})
			console.log('已经合并，上传成功')
		}
		// 更新上传进度
		const p = chunkIndex / (chunksSum - 1) * 100
		setProgress(Number(p.toFixed(2)))
	}
}