export function withProps<T>(outerProps: T, render: (props: T) => JSX.Element) {
    return render(outerProps);
}
