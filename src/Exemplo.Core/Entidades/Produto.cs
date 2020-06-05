using System;

namespace Exemplo.Core.Entidades
{
    public class Produto : Entidade
    {
        public int MarcaId { get; private set; }
        public string Nome { get; private set; }
        public float Valor { get; private set; }

        public virtual Marca Marca { get; private set; }

        public Produto(int marcaId, string nome, float valor)
        {
            MarcaId = marcaId;

            Nome = nome ?? throw new ArgumentNullException(nameof(nome));

            if (valor <= 0)
                throw new ArgumentOutOfRangeException(nameof(valor));

            Valor = valor;
        }
    }
}
