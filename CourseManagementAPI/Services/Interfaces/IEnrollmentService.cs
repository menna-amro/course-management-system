using CourseManagementAPI.DTOs;

namespace CourseManagementAPI.Services.Interfaces
{
    public interface IEnrollmentService
    {
        Task EnrollStudentAsync(
            CreateStudentEnrollmentDto dto,
            string userId);

        Task EnrollStudentByAdminAsync(
            CreateAdminEnrollmentDto dto);

        Task<IEnumerable<EnrollmentDto>> GetStudentCoursesAsync(
            string userId);

        Task<IEnumerable<EnrollmentDto>> GetCourseStudentsAsync(
            int courseId);

        Task DeleteAsync(int studentId, int courseId);

        Task WithdrawStudentAsync(string userId, int courseId);
    }
}