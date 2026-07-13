    import { useEffect, useRef, useState } from "react";

    import styles from "./Dropdown.module.css";

    import dropdownIcon from "../../../assets/icons/icon_dropdown.svg";

    const Dropdown = ({
    value,
    options,
    placeholder,
    onChange,
    }) => {
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setIsOpen(false);
        }
        };

        document.addEventListener(
        "mousedown",
        handleClickOutside
        );

        return () => {
        document.removeEventListener(
            "mousedown",
            handleClickOutside
        );
        };
    }, []);

    return (
        <div
        className={styles.dropdown}
        ref={dropdownRef}
        >
        <button
            type="button"
            className={styles.trigger}
            onClick={() => setIsOpen((prev) => !prev)}
        >
            <span>{value || placeholder}</span>

            <img
            src={dropdownIcon}
            alt=""
            className={`${styles.arrow} ${
                isOpen ? styles.rotate : ""
            }`}
            />
        </button>

        {isOpen && (
            <ul className={styles.menu}>
            {options.map((option) => (
                <li key={option}>
                <button
                    type="button"
                    className={styles.option}
                    onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    }}
                >
                    {option}
                </button>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
    };

    export default Dropdown;