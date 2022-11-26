import { MouseEvent, useState } from "react";
import TextFieldElement, { TextFieldElementProps } from "./TextFieldElement";
import { IconButton, IconButtonProps, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FieldValues } from "react-hook-form/dist/types/fields";

export type PasswordElementProps<T extends FieldValues> =
    TextFieldElementProps<T> & {
        iconColor?: IconButtonProps["color"];
    };

export default function PasswordElement<TFieldValues extends FieldValues>({
    iconColor,
    ...props
}: PasswordElementProps<TFieldValues>): JSX.Element {
    const [password, setPassword] = useState<boolean>(true);
    return (
        <TextFieldElement
            {...props}
            InputProps={{
                endAdornment: (
                    <InputAdornment position={"end"}>
                        <IconButton
                            onMouseDown={(e: MouseEvent<HTMLButtonElement>) =>
                                e.preventDefault()
                            }
                            onClick={() => setPassword(!password)}
                            tabIndex={-1}
                            color={iconColor ?? "default"}
                        >
                            {password ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            type={password ? "password" : "text"}
        />
    );
}
