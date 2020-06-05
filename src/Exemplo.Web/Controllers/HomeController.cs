using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Exemplo.Web.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Exemplo.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ExemploDbContext _dbContext;
        public HomeController(ILogger<HomeController> logger, ExemploDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
            if (!_dbContext.Cliente.Any())
            {
                for (int i = 0; i < 100; i++)
                {
                    _dbContext.Cliente.Add(new Cliente { Nome = $"Nome {i}", Cpf = $"{i}" });
                }
                _dbContext.SaveChanges();
            }
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Index2()
        {
            return View();
        }


        public async Task<IActionResult> BuscarDados(string searchText, string sortOrder, int pageNumber, int pageSize, int? id)
        {
            if (id.HasValue)
            {
                var cliente = await _dbContext.Cliente.FindAsync(id.Value);
                return Ok(new { cliente.Id, cliente.Nome, cliente.Cpf });
            }

            pageSize = pageSize < 10 ? 10 : pageSize;
            pageNumber = pageNumber < 1 ? 1 : pageNumber;

            var query = _dbContext.Cliente.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchText))
                query = query.Where(x => x.Nome.Contains(searchText) || x.Cpf.Contains(searchText));

            var rows = await query.OrderBy(x => x.Nome).Skip((pageNumber - 1) * pageSize)
                .Take(pageSize).Select(x => new { x.Id, x.Nome, x.Cpf }).ToListAsync();

            var total = await _dbContext.Cliente.CountAsync();

            return Ok(new { rows, total });
        }

        [HttpPost]
        public async Task<IActionResult> NovoCliente([FromBody]ClienteViewModel model)
        {
            if (ModelState.IsValid)
            {
                _dbContext.Cliente.Add(new Cliente { Nome = model.Nome, Cpf = model.Cpf });
                await _dbContext.SaveChangesAsync();
                return Ok(new { success = true, message = "Cadastrado com sucesso" });
            }

            return Ok(new { success = false, message = ModelState });
        }

        [HttpPut]
        public async Task<IActionResult> AtualizarCliente([FromQuery]int? id, [FromBody]ClienteViewModel model)
        {
            if (ModelState.IsValid)
            {
                var cliente = await _dbContext.Cliente.FindAsync(id ?? model.Id);
                cliente.Nome = model.Nome;
                cliente.Cpf = model.Cpf;
                await _dbContext.SaveChangesAsync();
                return Ok(new { success = true, message = "Atualizado com sucesso" });
            }

            return Ok(new { success = false, message = ModelState });
        }

        [HttpDelete]
        public async Task<IActionResult> ExcluirCliente([FromBody]int id)
        {
            var cliente = await _dbContext.Cliente.FindAsync(id);
            _dbContext.Remove(cliente);
            await _dbContext.SaveChangesAsync();

            return Ok(new { success = true, message = "Excluído com sucesso" });
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
