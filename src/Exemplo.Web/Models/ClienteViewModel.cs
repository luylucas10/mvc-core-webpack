using System.ComponentModel.DataAnnotations;

namespace Exemplo.Web.Models
{
    public class ClienteViewModel
    {
        public int Id { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(100)]
        public string Nome { get; set; }

        [Required]
        [MinLength(11)]
        [MaxLength(11)]
        public string Cpf { get; set; }
    }
}
