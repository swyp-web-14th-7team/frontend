import Dropdown from "../common/Dropdown/Dropdown";

import styles from "./CommonCardForm.module.css";

const CommonCardForm = ({
    data,
    affiliationStatuses = [],
    handleChange,
}) => {
    const affiliationOptions =
        affiliationStatuses.map(
            (status) =>
                status.name,
        );

    const handleStatusChange = (
        statusName,
    ) => {
        const selectedStatus =
            affiliationStatuses.find(
                (status) =>
                    status.name ===
                    statusName,
            );

        handleChange(
            "affiliationType",
            statusName,
        );

        handleChange(
            "affiliationStatusId",
            selectedStatus?.id ||
                null,
        );
    };

    return (
        <div
            className={
                styles.field
            }
        >
            <label
                className={`caption1 ${styles.label}`}
            >
                현 소속
            </label>

            <div
                className={
                    styles.affiliationRow
                }
            >
                <div
                    className={
                        styles.dropdownWrapper
                    }
                >
                    <Dropdown
                        value={
                            data.affiliationType
                        }
                        placeholder="현재 상태"
                        options={
                            affiliationOptions
                        }
                        onChange={
                            handleStatusChange
                        }
                    />
                </div>

                <input
                    className={
                        styles.input
                    }
                    value={
                        data.affiliation
                    }
                    maxLength={20}
                    onChange={(
                        event,
                    ) =>
                        handleChange(
                            "affiliation",
                            event.target
                                .value,
                        )
                    }
                    placeholder="텍스트를 입력하세요"
                />

                <p
                    className={
                        styles.count
                    }
                >
                    {
                        (
                            data.affiliation ||
                            ""
                        ).length
                    }
                    /20
                </p>
            </div>
        </div>
    );
};

export default CommonCardForm;