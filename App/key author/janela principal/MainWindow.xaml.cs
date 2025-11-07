using System.Text;
using System.Windows;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using key_author.app_principal;

namespace key_author
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private static readonly HttpClient client = new HttpClient();
        public MainWindow()
        {
            InitializeComponent();
        }

        private void codegor(object sender, RoutedEventArgs e)
        {
            CodeCor jan = new CodeCor();
            if(caixinha.Text == "Bruno")
            {
               jan.Show();
            }
        }
    }
}