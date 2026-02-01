import { useForm, type FieldValues } from "react-hook-form"
import { string, z } from "zod";
import axios from "axios";

import "../../common/common.css"
import "../../common/form/form.css"
import InputField from "../../common/form/InputField"
import PowersField from "../../common/form/PowersField"
import SubmitButton from "../../common/form/SubmitButton"
import TextAreField from "../../common/form/TextAreaField"
import { zodResolver } from "@hookform/resolvers/zod";
import ImagesField from "../../common/form/ImagesField";
import { buildBackendUrl } from "../../common/backendClient";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const schema = z.object({
    nickname: z.string().min(2),
    realName: z.string().min(2),
    originDescription: z.string().max(250),
    catchPhrase: z.string().max(200),

    superpowers: z.array(
    z.object({
        name: z.string().min(1) 
    })),

    images: z.array(
        z.union([
            z.instanceof(File),
            z.string()
        ])
    )
        .min(1)
        .refine(
            (files) => files.every(
                file => file instanceof File 
                ? file.size <= MAX_FILE_SIZE 
                : true
            )
        ),
});

type FormValues = z.infer<typeof schema>;

interface HeroData{
    id: number;
    nickname: string;
    realName: string;
    originDescription: string;
    catchPhrase: string;
    superpowers: string[];
    images: string[];
}

export default function EditHeroPage() {

    const { 
        register,
        control,
        handleSubmit, 
        formState: { errors },
        reset
     } = useForm<FormValues>({
        resolver: zodResolver(schema)
     });

    const { heroId } = useParams();
    const [ heroImages, setHeroImages ] = useState<string[]>([]);

    useEffect(() => {

        async function fetchData() {
            const url = buildBackendUrl("/heroes/" + heroId);

            try {
                const response = await axios.get(url);

                const data = response.data as HeroData;

                const formData = {
                    nickname: data.nickname,
                    realName: data.realName,
                    originDescription: data.originDescription,
                    catchPhrase: data.catchPhrase,
                    superpowers: data.superpowers.map(s => ({ name: s })),
                    images: data.images
                }
                
                reset(formData);
                setHeroImages(data.images);
                      
                
            } catch (error) {
                console.log("Errro:", error);
            }
        }

        fetchData();
    }, [heroId, reset])



    async function onSubmit(data: FieldValues) {
        const url = buildBackendUrl(`/heroes/${heroId}`);

        try {
            const formData = new FormData();

            const { images, superpowers, ...restDetails } = data;

            const hero = {
                ...restDetails,
                superpowers: superpowers.map((s: {name: string}) => s.name),
                deletedImages: [] as string[]
            };


            if (images && images.length > 0) {
                const updatedStringImages = images.filter(
                    (i: (File | string)) => typeof i === 'string'
                );

                for (const heroImage of heroImages) {
                    if (!updatedStringImages.includes(heroImage))
                    {
                        hero.deletedImages.push(heroImage);
                    }
                }
                

                images.forEach((file: (File | string)) => {
                    if (file instanceof File) {
                        formData.append("images", file);
                    }
                })
            }

            formData.append("data", JSON.stringify(hero));


            const response = await axios.put(
                url, 
                formData
            );

            console.log(response);

            alert("Hero had been updated");

        } catch (error) {
            console.error("Error on updated:", error);
            alert("Something went wrong, hero was not updated.");
        }
    }

    return <form onSubmit={handleSubmit(onSubmit)} className="gradient-box">
        <div className="box">
            <div className="form-content">

                <div className="title">
                    <h3>Edit the superhero</h3>
                </div>

                <div className="fields">
                    <InputField 
                        name="nickname"
                        label="nickname"
                        register={register}
                        error={errors.nickname?.message}
                    ></InputField>
                    <InputField 
                        register={register}
                        label="real name"
                        name="realName"
                        error={errors.realName?.message }
                    ></InputField>
                    <TextAreField 
                        register={register}
                        label="origin description"
                        name="originDescription"
                        error={errors.originDescription?.message}
                    ></TextAreField>
                    <TextAreField 
                        register={register}
                        label="catch phrase"
                        name="catchPhrase"
                        error={errors.catchPhrase?.message}
                    ></TextAreField>

                    <PowersField 
                        name="superpowers"
                        label="superpowers"
                        control={control}

                    ></PowersField>

                    <ImagesField
                        name="images"
                        control={control}
                    />
                        
                </div>

                <SubmitButton>Save</SubmitButton>

            </div>
        </div>

    </form>
}