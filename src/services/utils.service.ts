export function sortArray<Type>(array: Type[], sortArray: string[]): Type[] {
    return [...array].sort(
        (a: any, b: any) =>
            sortArray.indexOf(a.uuid) - sortArray.indexOf(b.uuid)
    );
}
