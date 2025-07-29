export function logFunctionCall(functionName: string, ...args: any[]): void {
  const formattedArgs =
    args.length > 0
      ? `(${args
          .map((arg) =>
            typeof arg === "string" ? `"${arg}"` : JSON.stringify(arg)
          )
          .join(", ")})`
      : "()";
  console.debug(`${functionName}${formattedArgs}`);
}
