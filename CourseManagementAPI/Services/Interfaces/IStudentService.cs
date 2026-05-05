using CourseManagementAPI.DTOs;
using CourseManagementAPI.DTOs.Student;

namespace CourseManagementAPI.Services.Interfaces
{
    public interface IStudentService
    {
        Task<IEnumerable<StudentDto>> GetAllAsync();
        Task<StudentDto?> GetByIdAsync(int id);
        Task CreateAsync(CreateStudentDto dto, string userId);
        Task UpdateAsync(int id, UpdateStudentDto dto);
        Task UpdateByUserIdAsync(string userId, UpdateStudentDto dto);
        Task DeleteAsync(int id);
        Task<StudentDto?> GetByUserIdAsync(string userId);
        Task<IEnumerable<EnrollmentDto>> GetCoursesAsync(int studentId);
    }
}