//W---------={ common mini functions are written here }=----------

// const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setUploading(true);
//     try {
//         const result = await uploadImage(file);
//         optionalForm.setValue('avatarUrl', result.secure_url);
//         toast({
//             title: "Success",
//             description: "Avatar uploaded successfully",
//         });
//     } catch {
//         toast({
//             title: "Error",
//             description: "Failed to upload avatar",
//             variant: "destructive",
//         });
//     } finally {
//         setUploading(false);
//     }
// };