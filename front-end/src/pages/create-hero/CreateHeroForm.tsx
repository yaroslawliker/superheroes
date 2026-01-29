import "../../common/common.css"
import "../../common/form/form.css"
import InputField from "../../common/form/InputField"
import SubmitButton from "../../common/form/SubmitButton"
import TextAreField from "../../common/form/TextAreaField"


export default function CreateHeroForm() {


    return <form className="gradient-box">
        <div className="box">
            <div className="form-content">

                <div className="title">
                    <h3>Create a superhero</h3>
                </div>

                <div className="fields">
                    <InputField fieldName="nickname"></InputField>
                    <InputField fieldName="real name"></InputField>
                    <TextAreField fieldName="origin description"></TextAreField>
                </div>

                <SubmitButton></SubmitButton>

            </div>
        </div>

    </form>
}