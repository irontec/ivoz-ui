import { ChangeEvent, useState } from 'react';


export type handleMultiselectChangeType = (event: ChangeEvent<HTMLInputElement>) => void;

const useMultiselectState = () => {

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleChange: handleMultiselectChangeType = (event) => {

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (value === true) {
        const newValues = [...selectedValues, name];
        setSelectedValues(newValues);
    } else {
        const newValues = selectedValues.filter(val => val !== name);
        setSelectedValues(newValues);
    }
  }

  return [selectedValues, handleChange, setSelectedValues] as const;
}

export default useMultiselectState;