    import { useEffect, useRef, useState } from "react";

    import styles from "./Dropdown.module.css";
    import dropdownIcon from "../../../assets/icons/icon_dropdown.svg";

    const Dropdown = ({
    value,
    options,
    placeholder = "선택",
    onChange,
    className = "",
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

        const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            setIsOpen(false);
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
        document.removeEventListener(
            "mousedown",
            handleClickOutside,
        );

        document.removeEventListener(
            "keydown",
            handleKeyDown,
        );
        };
    }, []);

    return (
        <div
        ref={dropdownRef}
        className={`${styles.dropdown} ${className}`}
        >
        <button
            type="button"
            className={`${styles.trigger} ${
            isOpen ? styles.triggerOpen : ""
            }`}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
        >
            <span className={styles.triggerText}>
            {value || placeholder}
            </span>

            <img
            src={dropdownIcon}
            alt=""
            className={`${styles.arrow} ${
                isOpen ? styles.rotate : ""
            }`}
            />
        </button>

        {isOpen && (
            <ul
            className={styles.menu}
            role="listbox"
            >
            {options.map((option) => {
                const isSelected = option === value;

                return (
                <li key={option}>
                    <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`${styles.option} ${
                        isSelected ? styles.selectedOption : ""
                    }`}
                    onClick={() => {
                        onChange(option);
                        setIsOpen(false);
                    }}
                    >
                    {option}
                    </button>
                </li>
                );
            })}
            </ul>
        )}
        </div>
    );
    };

    export default Dropdown;