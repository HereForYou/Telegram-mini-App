import { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { faPlus, faXmark, faPencil, faTrashCan, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ENDPOINT } from "../../data";

const DexSetting = ({ setting, setSetting }: { setting: any, setSetting: (value: any) => void }) => {
    const [editRow, setEditRow] = useState<number>(-1);
    const [addMode, setAddMode] = useState<boolean>(false);

    const [settingItem, setSettingItem] = useState<any>({
        id: 1,
        name: "",
        img: null
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        setSettingItem({
            ...settingItem,
            id: index + 1,
            name: e.target.value
        });
    }

    const handleDelete = (index: number) => {
        let isSure = window.confirm('You really want to delete this one?');
        if (isSure) {
            axios.delete(`${ENDPOINT}/api/setting/delete/dex/${index}`)
                .then(res => {
                    setSetting(res.data);
                    setEditRow(-1);
                    toast.success("Updated successfully!");
                })
                .catch(err => {
                    console.error("Something went wrong.", err);
                })
        }
    }

    const submitSetting = () => {
        const formData = new FormData();
        formData.append("id", settingItem.id.toString());
        formData.append("name", settingItem.name);
        if (settingItem.img) {
            formData.append("img", settingItem.img);
        }
        axios.put(`${ENDPOINT}/api/setting/update/dex/img`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then(res => {
                setSetting(res.data);
                setEditRow(-1);
                toast.success("Updated successfully!");
            })
            .catch(err => {
                console.error("Something went wrong.", err);
            });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSettingItem({
                ...settingItem,
                img: file
            });
        }
    };

    useEffect(() => {
        if (settingItem.img && settingItem.name) {
            submitSetting();
            setAddMode(false);
        }
    }, [settingItem.img]);

    return (
        <>
            <div className="overflow-y-auto text-white py-8 w-full">
                <div className="h-[60vh] w-full overflow-y-auto py-2">
                    <table className="text-center w-full">
                        <thead>
                            <tr>
                                <td className="text-[15px] font-bold">No</td>
                                <td className="text-[15px] font-bold">Dex Name</td>
                                <td className="text-[15px] font-bold">Image</td>
                                <td className="text-[15px] font-bold">Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                setting?.dexList.map((item: any, index: number) => (
                                    editRow !== index ? (
                                        <tr key={index}>
                                            <td className="text-[13px] font-bold w-[10%] md:w-[30%]">{index + 1}</td>
                                            <td className="text-[13px] w-[30%]">{item.name}</td>
                                            <td className="text-[13px] w-[30%]">
                                                <div className="w-full flex items-center justify-center">
                                                    <img
                                                        src={`${item?.img ? `${ENDPOINT}/${item?.img}` : 'unknown.svg'}`} loading='lazy' className={`rounded-full overflow-hidden w-8 h-8`}
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-[13px] w-[30%] space-x-4">
                                                <button onClick={
                                                    () => {
                                                        setEditRow(index);
                                                        setAddMode(false);
                                                        setSettingItem({
                                                            id: index + 1,
                                                            name: `${item.name}`,
                                                        })
                                                    }
                                                } className="actionBtn">
                                                    <FontAwesomeIcon icon={faPencil} className="mr-1" />
                                                    {/* Edit */}
                                                </button>
                                                <button onClick={
                                                    () => {
                                                        setAddMode(false);
                                                        handleDelete(index);
                                                    }
                                                } className="actionBtn">
                                                    <FontAwesomeIcon icon={faTrashCan} className="mr-1" />
                                                    {/* Delete */}
                                                </button>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={index} className="">
                                            <td className="text-[13px] font-bold w-[10%] md:w-[30%]">{index + 1}</td>
                                            <td className="text-[13px] font-bold w-[30%]">
                                                <input
                                                    type="text" className="h-[30px] w-[60px]"
                                                    placeholder="Dex Name"
                                                    name="name"
                                                    value={settingItem.name}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, index)}
                                                />
                                            </td>
                                            <td className="text-[13px] w-[30%]">
                                                <div className="w-full flex items-center justify-center">
                                                    <img
                                                        src={`${item?.img ? `${ENDPOINT}/${item?.img}` : 'unknown.svg'}`} loading='lazy' className={`rounded-full overflow-hidden w-8 h-8 cursor-pointer hover:opacity-30`}
                                                        onClick={() => document.getElementById(`file-input-${index}`)?.click()}
                                                    />
                                                    <input
                                                        id={`file-input-${index}`}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleImageChange}
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-[13px] w-[30%] space-x-4">
                                                <button onClick={submitSetting} className="actionBtn">
                                                    <FontAwesomeIcon icon={faSave} className="mr-1" />
                                                    {/* Save */}
                                                </button>
                                                <button onClick={() => setEditRow(-1)} className="actionBtn">
                                                    <FontAwesomeIcon icon={faXmark} className="mr-1" />
                                                    {/* Cancel */}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                ))
                            }
                            {
                                addMode && (
                                    <tr className="">
                                        <td className="text-[13px] font-bold">{setting?.dexList.length + 1}</td>
                                        <td className="text-[13px] font-bold">
                                            <input
                                                type="text" className="h-[30px] w-[100px]"
                                                placeholder="Dex Name"
                                                name="name"
                                                value={settingItem.name}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, setting?.dexList.length)}
                                            />
                                        </td>
                                        <td className="text-[13px] w-[30%]">
                                            <div className="w-full flex items-center justify-center">
                                                <img
                                                    src={`${settingItem?.img ? `${ENDPOINT}/${settingItem?.img}` : 'unknown.svg'}`} loading='lazy' className={`rounded-full overflow-hidden w-8 h-8 cursor-pointer hover:opacity-30`}
                                                    onClick={() => document.getElementById(`file-input-${setting?.dexList.length}`)?.click()}
                                                />
                                                <input
                                                    id={`file-input-${setting?.dexList.length}`}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />

                                            </div>
                                        </td>
                                        <td className="text-[13px] space-x-4">
                                            <button onClick={() => { setAddMode(false), submitSetting(); }} className="actionBtn">
                                                <FontAwesomeIcon icon={faSave} className="mr-1" />
                                                {/* Save */}
                                            </button>
                                            <button onClick={() => { setAddMode(false) }} className="actionBtn">
                                                <FontAwesomeIcon icon={faXmark} className="mr-1" />
                                                {/* Cancel */}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    <button onClick={() => {
                        setAddMode(true);
                        setEditRow(setting?.dexList.length);
                        setSettingItem({
                            id: setting?.dexList.length + 1,
                            username: "",
                        })
                    }} className="actionBtn mt-8">
                        <FontAwesomeIcon icon={faPlus} className="mr-1" />
                        Add
                    </button>
                </div>
            </div>
        </>
    )
}

export default DexSetting;