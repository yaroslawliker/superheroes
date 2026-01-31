import { useController, type Control, type FieldValues, type Path, type PathValue } from "react-hook-form";
import { buildMinioUrl, extractName } from "../minioClient";
import type { ChangeEvent } from "react";
import Error from "./Error";
import { capitalize } from "../utils";


interface Props<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
}

export default function ImagesField<T extends FieldValues>({ name, control}: Props<T>) {

    const {
        field: {value, onChange},
        fieldState: { error }
    } = useController({
        name,
        control,
        defaultValue: [] as PathValue<T, Path<T>>
    });
    
    function handleFilesChange(e: ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;

        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);

        onChange([...(value || []), ...newFiles]);
        e.target.value = '';
    }

    function handleRemove(indexToRemove: number) {
        const newFiles = (value as File[]).filter(
            (_, index) => index !== indexToRemove
        );
        onChange(newFiles);
    }

    const images = (value as File[]).map(
        (file, index) => 
            <ImageItem 
                file={file} 
                onRemove={() => handleRemove(index)}
                key={file.name}
                                
            />
    );

    return <div style={{ width: '100%' }}>

        <label className="file-input-label">
            <div className="field-name">{capitalize(name)}</div>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                style={{display: 'none'}}
            />
            <div
                className="file-input-button">
                Upload images
            </div>
        </label>
        <div className="images">
            {images}
        </div>
        { error &&<Error>{error.message}</Error> }
        
    </div>    
}

interface ImageItemProps {
    file:  File | string;
    onRemove: () => void;
}

function ImageItem({ file, onRemove }: ImageItemProps) {

    const createImageUrl = (file: File | string) => {
        if (typeof file === 'string') {
            return buildMinioUrl(file);
        } else {
            return URL.createObjectURL(file);
        }
    };

    const filename = file instanceof File? file.name: file;

    return <div className="image-field-item">
        <div className="image-field-item-text">{extractName(filename)}</div>
        <img src={createImageUrl(file)}></img>
        <button 
            type="button" 
            className="image-field-button"
            onClick={onRemove}
        >x</button>
    </div>
}