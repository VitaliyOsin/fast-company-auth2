import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { validator } from "../../../utils/ validator";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radio.Field";
import MultiSelectField from "../../common/form/multiSelectField";
import BackHistoryButton from "../../common/backButton";
import { useProfessions } from "../../../hooks/useProfession";
import { useQualities } from "../../../hooks/useQualities";
import { useAuth } from "../../../hooks/useAuth";

const EditUserPage = () => {
    const { currentUser, updateUser } = useAuth();
    const { userId } = useParams();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: "",
        profession: "",
        sex: "male",
        qualities: []
    });
    const { professions, isLoading: professionLoading } = useProfessions();
    const { qualities, isLoading: qualityLoading, getQuality } = useQualities();
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        try {
            await updateUser({ ...data, qualities: data.qualities.map(q => q.value) });
            history.push(`/users/${data._id}`);
        } catch (error) {
            errorCatcher(error);
        }
    };
    const transformData = (data) => {
        return data.map((qual) => ({ label: qual.name, value: qual._id }));
    };
    useEffect(() => {
        if (userId !== currentUser._id) {
            history.push("/users/" + currentUser._id + "/edit");
        }
        setIsLoading(true);
        setData(({
            ...currentUser,
            qualities: transformData([...currentUser.qualities.map(cu => getQuality(cu))])
        }));
    }, []);
    useEffect(() => {
        if (data._id) setIsLoading(false);
    }, [data]);

    const validatorConfig = {
        email: {
            isRequired: {
                message: "?????????????????????? ?????????? ?????????????????????? ?????? ????????????????????"
            },
            isEmail: {
                message: "Email ???????????? ??????????????????????"
            }
        },

        name: {
            isRequired: {
                message: "?????????????? ???????? ??????"
            }
        },
        image: {
            isRequired: {
                message: "?????????????? URL ????????????????"
            }
        },
        completedMeetings: {
            isRequired: {
                message: "?????????????? ???????????????????? ??????????????????"
            },
            isNum: {
                message: "?????????? ???????????? ??????????"
            }
        },
        rate: {
            isRequired: {
                message: "?????????????? ??????????????"
            },
            isNum: {
                message: "?????????? ???????????? ??????????"
            }
        }
    };

    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    function errorCatcher(error) {
        const { message } = error.response.data;
        setErrors(message);
    }
    const isValid = Object.keys(errors).length === 0;

    useEffect(() => validate(), [data]);

    return (
        <div className="container mt-5">
            <BackHistoryButton />
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {!isLoading && !professionLoading && !qualityLoading && Object.keys(professions).length > 0 ? (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="??????"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="?????????????????????? ??????????"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <TextField
                                label="????????????????"
                                name="image"
                                value={data.image}
                                onChange={handleChange}
                                error={errors.image}
                            />
                            <TextField
                                label="??????????????"
                                name="rate"
                                value={`${data.rate}`}
                                onChange={handleChange}
                                error={errors.rate}
                            />
                            <TextField
                                label="??????????????????"
                                name="completedMeetings"
                                value={`${data.completedMeetings}`}
                                onChange={handleChange}
                                error={errors.completedMeetings}
                            />
                            <SelectField
                                label="???????????? ???????? ??????????????????"
                                defaultOption="Choose..."
                                name="profession"
                                options={transformData(professions)}
                                onChange={handleChange}
                                value={data.profession}
                                error={errors.profession}
                            />
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" },
                                    { name: "Other", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="???????????????? ?????? ??????"
                            />
                            <MultiSelectField
                                defaultValue={ transformData(qualities.filter(qu => currentUser.qualities.includes(qu._id))) }
                                options={transformData(qualities)}
                                onChange={handleChange}
                                name="qualities"
                                label="???????????????? ???????? ????????????????"
                            />
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-100 mx-auto"
                            >
                                ????????????????
                            </button>
                        </form>
                    ) : (
                        "Loading..."
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditUserPage;
