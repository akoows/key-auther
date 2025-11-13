using key_author.app_principal;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Windows;

namespace key_author
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private async void Butaum_click(object sender, RoutedEventArgs e)
        {
            string licenseKey = caixinha.Text.Trim();
            string validationHash = "092ecae4cfad38d7f640f9bdc1f843b57955336bb65294116eae59fec4af4e5e";

            if (string.IsNullOrEmpty(licenseKey))
            {
                MessageBox.Show("Insira a chave de autenticação.");
                return;
            }

            try
            {
                using var client = new HttpClient();

                string url = $"https://keyer.camposcloud.app/api/licenses/{licenseKey}/validate";

                var body = new { validationHash = validationHash };
                string json = JsonSerializer.Serialize(body);

                var response = await client.PostAsync(
                    url,
                    new StringContent(json, Encoding.UTF8, "application/json")
                );

                string content = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Falha na validação:\n" + content);
                    return;
                }

                // Sucesso → Licença válida!
                MessageBox.Show("Licença válida! Abrindo aplicação...");

                CodeCor appWindow = new CodeCor();
                appWindow.Show();

                this.Close(); // fecha a tela de login
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erro ao conectar:\n" + ex.Message);
            }
        }
    }
}
