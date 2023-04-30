using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Webpack.Models;

public static class LoadWebpack
{
	private static Dictionary<string, Tuple<string, string>> Css { get; } = new();
	private static Dictionary<string, Tuple<string, string>> Js { get; } = new();

	public static void Load()
	{
		//open stats.json file to read, creating a dictionary of css and js files to read
		// in our .cshtml files;
		using var status = File.OpenRead("stats.json");
		using var streamReader = new StreamReader(status);
		using var textReader = new JsonTextReader(streamReader);
		var jsonObjects = JObject.Load(textReader);

		var assetsChunks = jsonObjects["assetsByChunkName"];
		var assets = jsonObjects["assets"];

		var item = assets
			?.Select(x =>
				new
				{
					name = x["name"]?.ToString(),
					integrity = x["info"]?["integrity"]?.ToString()
				})
			?.ToList();

		foreach (var asset in assetsChunks)
		{
			var property = (JProperty)asset;
			foreach (var value in property.Value.ToObject<string[]>())
				if ((value?.StartsWith("css") ?? false) && !Css.ContainsKey(property.Name))
					Css.Add(property.Name, new Tuple<string, string>(value, item?.FirstOrDefault(a => a.name == value)?.integrity!));
				else if ((value?.StartsWith("js") ?? false) && !Js.ContainsKey(property.Name))
					Js.Add(property.Name, new Tuple<string, string>(value, item?.FirstOrDefault(a => a.name == value)?.integrity!));
		}
	}

	public static Tuple<string, string> LoadCss(string name)
	{
		if (Css.TryGetValue(name, out var styleFile))
		{
			Load();
			Css.TryGetValue(name, out styleFile);
		}

		return styleFile!;
	}

	public static Tuple<string, string> LoadJs(string name)
	{
		if (Js.TryGetValue(name, out var scriptFile))
		{
			Load();
			Js.TryGetValue(name, out scriptFile);
		}

		return scriptFile!;
	}
}