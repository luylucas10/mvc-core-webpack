using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace Exemplo.Web.Models
{
    public class ExemploDbContext : DbContext
    {
        public ExemploDbContext(DbContextOptions<ExemploDbContext> opt) : base(opt)
        {

        }

        public DbSet<Cliente> Cliente { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new ClienteConfig());
        }
    }

    public class Cliente
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Cpf { get; set; }
    }

    public class ClienteConfig : IEntityTypeConfiguration<Cliente>
    {
        public void Configure(EntityTypeBuilder<Cliente> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Nome).IsRequired().HasColumnType("varchar(100)").HasMaxLength(100);
            builder.Property(x => x.Cpf).IsRequired().HasColumnType("varchar(14)").HasMaxLength(14);

            builder.HasIndex(x => x.Cpf).HasName("IxClienteCpf").IsUnique(true);
        }
    }

}
