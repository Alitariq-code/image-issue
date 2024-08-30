import React, { useState } from "react";
import "./App.css";
import "tailwindcss/tailwind.css";
import Group from "./Group.png";
import axios from "axios";

function App() {
	const [selectedImage, setSelectedImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [responseData, setResponseData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			setSelectedImage(file);
			setImagePreview(URL.createObjectURL(file)); // For previewing the image
		}
	};

	const handleButtonClick = () => {
		document.getElementById("fileInput").click();
	};

	const handleProcessImage = async () => {
		if (!selectedImage) return;

		setIsLoading(true);

		const formData = new FormData();
		formData.append("file", selectedImage); // Append the actual file

		try {
			const response = await axios.post(
				"https://search.nala.art/action_based/v3",
				formData
			);

			setResponseData(response.data);
		} catch (error) {
			console.error("Error processing image:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-white text-black">
			<div className="container mx-auto p-4 w-3/4">
				<h1 className="text-3xl font-semibold text-center mb-8">
					Nala V3 Model
				</h1>
				<div
					className="bg-gray-100 p-6 rounded-lg mb-8 text-center flex flex-col items-center justify-center"
					style={{ height: "374px" }}
				>
					{imagePreview ? (
						<img
							src={imagePreview}
							alt="Uploaded"
							className="!w-[150px] !h-[150px] mb-4 object-cover rounded-lg" 
							style={{ height: "75px", width: "75PX" }}
						/>
					) : (
						<img
							src={Group}
							alt="Placeholder"
							className="w-[50px] h-[50px] mb-4"
						/>
					)}
					<p className="mb-4">
						Drag and Drop a file <br /> or
					</p>
					<input
						type="file"
						accept="image/*"
						id="fileInput"
						className="hidden"
						onChange={handleImageUpload}
					/>
					<button
						onClick={handleButtonClick}
						className="bg-white text-black py-2 px-4 rounded"
					>
						Upload Image
					</button>
				</div>
				<div className="text-center mb-4">
					<button
						onClick={handleProcessImage}
						className="bg-gray-100 hover:bg-gray-100 text-black py-2 px-4 rounded"
					>
						Process Image
					</button>
				</div>

				{isLoading ? (
					<div className="text-center">
						<div className="spinner mb-4"></div>
						<p>Please wait, data is loading...</p>
						<span class="loader mb-4"></span>
					</div>
				) : selectedImage && responseData.length > 0 ? (
					<div className="grid grid-cols-4 gap-4">
						{responseData.map((data, index) => (
							<div key={index} className="flex flex-col items-center">
								<div className="border-2 border-black w-[300px] h-[300px] overflow-hidden p-3">
									<img
										src={data.url}
										alt="Processed Image"
										className="object-cover w-full h-full"
									/>
								</div>
								<p className="mt-2 text-center border-2 border-black w-[150px] p-2">
									Similarity Score: {data.similarity}
								</p>
							</div>
						))}
					</div>
				) : (
					<p className="text-center">Please upload an image to process.</p>
				)}
			</div>
		</div>
	);
}

export default App;
