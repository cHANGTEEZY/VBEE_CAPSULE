import { useQuery } from "@tanstack/react-query";

const capsuleQuery = useQuery({
  queryKey: ["capsule"],
  queryFn: 
});

const createCapsule = async (data: any) => {
  const response = await fetch("https://api.example.com/capsules", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create capsule");
  }

  return response.json();
}