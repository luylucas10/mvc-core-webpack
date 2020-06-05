using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace Exemplo.Core.Entidades
{
    public class Marca : Entidade
    {
        private ICollection<Produto> _produtos;

        public string Nome { get; private set; }

        public virtual IReadOnlyCollection<Produto> Produtos => _produtos.ToList();

        public Marca(string nome)
        {
            _produtos = new Collection<Produto>();
            Nome = nome ?? throw new ArgumentNullException(nameof(nome));
        }
    }
}
