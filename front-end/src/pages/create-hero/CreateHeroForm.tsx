import { useForm, type FieldValues } from "react-hook-form"
import { z } from "zod";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const schema = z.object({
    nickname: z.string().min(2),
    realName: z.string().min(2),
    originDescription: z.string().max(250),

    superpowers: z.array(
    z.object({
        name: z.string().min(1) 
    })),

    images: z.array(z.instanceof(File))
        .min(1)
        .refine(
            (files) => files.every(
                file => file.size <= MAX_FILE_SIZE
            )
        ),
});

type FormValues = z.infer<typeof schema>;


export default function CreateHeroForm() {

    const { 
        register,
        control,
        handleSubmit, 
        formState: { errors },
        reset
     } = useForm<FormValues>({
        resolver: zodResolver(schema)
     });

    
    async function onSubmit(data: FieldValues) {
        const url = buildBackendUrl("/heroes");

        try {
            const formData = new FormData();

            const { images, superpowers, ...restDetails } = data;

            const hero = {
                ...restDetails,
                superpowers: superpowers.map((s: {name: string}) => s.name)
            };

            formData.append("data", JSON.stringify(hero));

            if (images && images.length > 0) {
                images.forEach((file: File) => {
                    formData.append("images", file);
                })
            }

            const response = await axios.post(
                url, 
                formData
            );

            console.log(response);

            alert("Hero had been created");

        } catch (error) {
            console.error("Error on creation:", error);
            alert("Something went wrong, hero was not created.");
        }

        reset();
    }

    return <form onSubmit={handleSubmit(onSubmit)} className="gradient-box">
        <div className="box">
            <div className="form-content">

                <div className="title">
                    <h3>Create a superhero</h3>
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

                <SubmitButton></SubmitButton>

            </div>
        </div>

    </form>
}