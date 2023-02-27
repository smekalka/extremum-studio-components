import {Meta, Story} from "@storybook/react";
import GridsView, {IGridsViewProps} from "../src/modules/grids/GridsView";
import {IGridsProps} from "../src/modules/grids/Grids";

const meta: Meta = {
    title: 'Welcome',
    component: GridsView,
    argTypes: {
        children: {
            control: {
                type: 'text',
            },
        },
    },
    parameters: {
        controls: {expanded: true},
    },
};

const Template: Story<Omit<IGridsProps, "controller" | "dataHandler"> & IGridsViewProps> = args =>
    <GridsView {...args} />;
export const Default = Template.bind({});
const initalData = [
    {
        id: '1',
        exchange: 'Wonder who',
        subscriber: '7cbb9dd8-9c93-11ed-a8fc-0242ac120002',
        function: 'SomeFunc',
    },
    {
        id: '2',
        exchange: 'Some who',

        subscriber: '7cbb9dd8-9c93-11ed-a8fc-0242ac120002',
        function: 'Be happy',
    },
    {
        id: '3',
        exchange: 'Wonder who',
        subscriber: '7cbb9dd8-9c93-11ed-a8fc-0242ac120002',
        function: 'test',
    },
    {
        id: '4',
        exchange: 'Another who',
        subscriber: '7cbb9dd8-9c93-11ed-a8fc-0242ac120002',
        function: 'Be well',
    },
]
Default.args = {
    data: [...initalData],
    updateDataFromServe: function () {
        this.data = initalData
    },
    setGridsData: function (value) {
        this.data = value
    },
    options: {},
    columns: [
        {
            key: "exchange",
            title: "Exchange"
        },
        {
            key: "function",
            title: "Function"
        },
        {
            key: "subscriber",
            title: "Subscriber"
        }
    ],
    vscode: {
        state: {},
        getState: function () {
            return this.state
        },
        setState(value) {
            this.state = value
        }
    }
}
