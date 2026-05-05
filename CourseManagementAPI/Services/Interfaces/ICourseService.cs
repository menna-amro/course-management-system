namespace CourseManagementAPI.Services.Interfaces
{

    public interface ICourseService
    {
        Task<IEnumerable<CourseDto>> GetAllAsync();
        Task<CourseDto?> GetByIdAsync(int id);
        Task CreateAsync(CreateCourseDto dto);
        Task UpdateAsync(int id, UpdateCourseDto dto);
        Task DeleteAsync(int id);
    }
}