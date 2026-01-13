import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ky from "ky";

interface Response {
    status: string,
    method: string,
}

export const Route = createFileRoute('/about')({
    component: About,
})

function About() {
    const { data, isLoading } = useQuery({
        queryKey: ["dummyJson"],
        queryFn: (): Promise<Response> => {
            return ky.get("https://dummyjson.com/test").json()
        }
    })
    return (
        <div>
            Hello from "About"
            <br />
            {isLoading && "loadig .."}
            {
                data?.status
            }
            <br />
            {
                data?.method
            }
        </div>
    )

}
