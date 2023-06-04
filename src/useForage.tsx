import localforage from "localforage";
import {useState} from "react";

export default function <T>(
    key: string,
    fallbackData: T
): [T, (newData: T) => void] {
    const [data, setData] = useState<T | null>(null)
    localforage.getItem<T>(key).then(newData => {
        if (data === null) setData(newData)
    })
    return [data ?? fallbackData, (newData: T) => localforage.setItem<T>(key, newData).then(setData)]
}
