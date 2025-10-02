import Swal from "sweetalert2";

export const confirmNotification = async (key: string): Promise<boolean> => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Yes, ${key} it!`,
  });
  return result.isConfirmed;
};

// export function alertAuth(key: boolean) {
//   // if (key) {
//   // } else {
//   // }
// }
