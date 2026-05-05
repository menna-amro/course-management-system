using CourseManagementAPI.DTOs;
using CourseManagementAPI.DTOs.Instructor;

namespace CourseManagementAPI.Services.Interfaces
{
    public interface IInstructorService
    {
        Task<IEnumerable<InstructorDto>> GetAllAsync();
        Task<InstructorDto?> GetByIdAsync(int id);
        Task<InstructorDto?> GetByUserIdAsync(string userId);
        Task CreateAsync(CreateInstructorDto dto, string userId);
        Task UpdateAsync(int id, UpdateInstructorDto dto);
        Task UpdateByUserIdAsync(string userId, UpdateInstructorDto dto);
        Task DeleteAsync(int id);

        Task<List<CourseDto>> GetMyCoursesAsync(string userId);
        Task<List<CourseDto>> GetCoursesByInstructorIdAsync(int instructorId);
    }
}